"use client";

import { useRef, useState, type ReactNode } from "react";
import { Download, ExternalLink, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { CandidateEditProfile } from "@/lib/hiring/candidateProfile";
import { deleteCandidateResume, uploadCandidateResume } from "@/lib/hiring/candidateProfile";
import { parseResumeFile } from "@/lib/hiring/parseResume";
import {
  candidateHasResume,
  displayCandidateName,
  resumeDisplayStatus,
  resumeFileName,
} from "@/lib/hiring/candidateReportView";
import type { HiringCandidate } from "@/lib/hiring/types";
import {
  dashboardLabel,
  dashboardPanel,
  dashboardPanelInteractive,
  dashboardSectionSub,
  dashboardSectionTitle,
} from "@/components/dashboard/dashboardTokens";
import { DeleteResumeAlertDialog } from "./DeleteResumeAlertDialog";

const bentoCardBase =
  "min-w-0 rounded-2xl border border-[rgba(15,23,42,0.06)] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_8px_28px_-12px_rgba(15,23,42,0.08)] dark:border-white/[0.06] dark:bg-surface";

function resumeExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

/** Dummy resume content — stands in for a real document so the preview is scrollable */
const RESUME_SUMMARY =
  "Product designer focused on B2B SaaS, design systems, and research-driven product decisions. Owns problems end to end — from discovery and prototyping through polished, shipped interfaces — and partners closely with engineering and product management to ship measurable outcomes.";

const RESUME_EXPERIENCE = [
  {
    role: "Senior Product Designer",
    company: "Northwind Labs",
    period: "2022 — Present",
    bullets: [
      "Owned the redesign of the core workspace, lifting weekly active usage by 23% quarter over quarter.",
      "Built and maintained the shared design system adopted across six product teams.",
      "Partnered with research on 40+ customer interviews to shape the annual roadmap.",
      "Mentored two junior designers and introduced a weekly critique ritual.",
    ],
  },
  {
    role: "Product Designer",
    company: "Bluepeak",
    period: "2019 — 2022",
    bullets: [
      "Shipped the onboarding flow that reduced time-to-first-value by 35%.",
      "Led end-to-end design for the billing and subscriptions experience.",
      "Collaborated with data to instrument funnels and close feedback loops.",
    ],
  },
  {
    role: "UX Designer",
    company: "Craftly",
    period: "2017 — 2019",
    bullets: [
      "Designed and tested the mobile booking experience from zero to launch.",
      "Created the component library that became the team's first design foundation.",
    ],
  },
];

const RESUME_PROJECTS = [
  {
    name: "Design System 2.0",
    desc: "Led a cross-functional effort to unify tokens, components, and documentation into a single source of truth used by every squad.",
  },
  {
    name: "Insights Dashboard",
    desc: "Concept-to-ship analytics surface used daily by 1,200+ customers to monitor pipeline health.",
  },
  {
    name: "Mobile Companion App",
    desc: "0→1 companion experience, from early research through usability testing and public launch.",
  },
];

const RESUME_CERTS = [
  "Nielsen Norman Group — UX Certification",
  "Interaction Design Foundation — Design Systems",
  "Google — Foundations of UX Design",
];

const RESUME_FALLBACK_EDUCATION = [
  {
    degree: "M.A. Interaction Design",
    details: "University of the Arts · 2015 — 2017\nThesis on adaptive interfaces for complex data workflows.",
  },
  {
    degree: "B.A. Visual Communication",
    details: "State University · 2011 — 2015\nGraduated with honors; led the student design collective.",
  },
];

const RESUME_FALLBACK_SKILLS = [
  "Product design",
  "Design systems",
  "Prototyping",
  "User research",
  "Figma",
  "Interaction design",
  "Accessibility",
  "Design ops",
];

const resumeSectionHeading =
  "text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6D28D9]";

function ResumeSheet({ children, page, total }: { children: ReactNode; page: number; total: number }) {
  return (
    <div
      className="mx-auto flex w-full max-w-[760px] flex-col rounded-[6px] border border-[rgba(15,23,42,0.08)] bg-white px-8 py-10 text-[#27272A] shadow-[0_1px_2px_rgba(15,23,42,0.06),0_12px_32px_-14px_rgba(15,23,42,0.22)] sm:px-12 sm:py-14"
      style={{ minHeight: 940 }}
    >
      <div className="min-h-0 flex-1">{children}</div>
      <p className="mt-10 border-t border-[rgba(15,23,42,0.08)] pt-3 text-center text-[11px] text-[#A1A1AA]">
        Page {page} of {total}
      </p>
    </div>
  );
}

function ResumePaperPreview({
  candidate,
  profile,
}: {
  candidate: HiringCandidate;
  profile: CandidateEditProfile;
}) {
  const name = displayCandidateName(profile, candidate.name);
  const email = profile.email || candidate.email;
  const phone = profile.mobile || candidate.phone;
  const location = candidate.location?.trim();
  const role = RESUME_EXPERIENCE[0].role;

  const education =
    profile.education.filter((e) => e.degree.trim() || e.details.trim());
  const educationEntries = education.length > 0 ? education : RESUME_FALLBACK_EDUCATION;
  const skills = profile.skills.length > 0 ? profile.skills : RESUME_FALLBACK_SKILLS;

  return (
    <div className="space-y-6" aria-label={`Resume preview for ${name}`}>
      {/* Page 1 */}
      <ResumeSheet page={1} total={2}>
        <header className="border-b border-[rgba(15,23,42,0.1)] pb-5">
          <h1 className="text-[26px] font-bold tracking-tight">{name}</h1>
          <p className="mt-1 text-[15px] font-medium text-[#52525B]">{role}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-[#71717A]">
            {email ? <span>{email}</span> : null}
            {phone ? <span>{phone}</span> : null}
            {location && location !== "—" ? <span>{location}</span> : null}
          </p>
        </header>

        <section className="mt-7">
          <h2 className={resumeSectionHeading}>Summary</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[#3F3F46]">{RESUME_SUMMARY}</p>
        </section>

        <section className="mt-7">
          <h2 className={resumeSectionHeading}>Experience</h2>
          <div className="mt-3 space-y-5">
            {RESUME_EXPERIENCE.map((exp) => (
              <div key={exp.company}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[14px] font-semibold">
                    {exp.role} <span className="font-medium text-[#52525B]">· {exp.company}</span>
                  </p>
                  <p className="shrink-0 text-[12px] text-[#A1A1AA]">{exp.period}</p>
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-[#52525B]">
                  {exp.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </ResumeSheet>

      {/* Page 2 */}
      <ResumeSheet page={2} total={2}>
        <section>
          <h2 className={resumeSectionHeading}>Education</h2>
          <div className="mt-3 space-y-4">
            {educationEntries.map((edu, i) => (
              <div key={edu.degree + i}>
                <p className="text-[14px] font-semibold">{edu.degree}</p>
                {edu.details.trim() ? (
                  <p className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-[#52525B]">
                    {edu.details}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className={resumeSectionHeading}>Skills</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-md border border-[rgba(15,23,42,0.08)] bg-[#F4F4F5] px-2.5 py-1 text-[12px] font-medium text-[#3F3F46]"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className={resumeSectionHeading}>Selected Projects</h2>
          <div className="mt-3 space-y-4">
            {RESUME_PROJECTS.map((proj) => (
              <div key={proj.name}>
                <p className="text-[14px] font-semibold">{proj.name}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#52525B]">{proj.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className={resumeSectionHeading}>Certifications</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-[#52525B]">
            {RESUME_CERTS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      </ResumeSheet>
    </div>
  );
}

function ResumePreviewFrame({
  fileName,
  resumeUrl,
  candidate,
  profile,
  className,
}: {
  fileName: string;
  resumeUrl?: string;
  candidate: HiringCandidate;
  profile: CandidateEditProfile;
  className?: string;
}) {
  const isPdf = resumeExtension(fileName) === "pdf";
  const src = resumeUrl?.startsWith("http") ? resumeUrl : resumeUrl;

  return (
    <div
      className={cn(
        "relative flex min-h-[min(520px,58vh)] flex-1 flex-col overflow-hidden rounded-xl border border-[rgba(15,23,42,0.08)] bg-[#F4F4F5]",
        className,
      )}
    >
      {isPdf && src ? (
        <iframe
          src={src}
          title={`Resume preview: ${fileName}`}
          className="h-full min-h-[min(520px,58vh)] w-full flex-1 border-0 bg-white"
        />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <ResumePaperPreview candidate={candidate} profile={profile} />
        </div>
      )}
    </div>
  );
}

export function CandidateReportResume({
  candidate,
  profile,
  onCandidateUpdated,
  cardClassName,
  titleClassName,
}: {
  candidate: HiringCandidate;
  profile: CandidateEditProfile;
  onCandidateUpdated: (candidate: HiringCandidate) => void;
  cardClassName?: string;
  titleClassName?: string;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [fullOpen, setFullOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const deleteTriggerRef = useRef<HTMLButtonElement>(null);
  const uploadAreaRef = useRef<HTMLLabelElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const skipDeleteFocusReturnRef = useRef(false);

  const hasResume = candidateHasResume(profile, candidate);
  const file = resumeFileName(profile, candidate);
  const parsedStatus = resumeDisplayStatus(profile, candidate);
  const resumeUrl = candidate.resumeUrl;

  const shellClass =
    cardClassName ?? cn(bentoCardBase, dashboardPanelInteractive, "flex flex-col p-5 sm:p-6");
  const headingClass = titleClassName ?? dashboardSectionTitle;

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    const updated = deleteCandidateResume(candidate.id, profile);
    setDeleting(false);
    if (!updated) {
      toast.error("Could not delete resume");
      return;
    }
    toast.success("Resume deleted successfully");
    onCandidateUpdated(updated);
    skipDeleteFocusReturnRef.current = true;
    setDeleteOpen(false);
    setFullOpen(false);
    requestAnimationFrame(() => uploadAreaRef.current?.focus());
  };

  const handleDeleteOpenChange = (open: boolean) => {
    setDeleteOpen(open);
    if (!open) {
      if (skipDeleteFocusReturnRef.current) {
        skipDeleteFocusReturnRef.current = false;
        return;
      }
      requestAnimationFrame(() => deleteTriggerRef.current?.focus());
    }
  };

  const handleFile = async (picked: File) => {
    if (hasResume) return;
    setUploading(true);
    try {
      const updated = uploadCandidateResume(candidate.id, profile, picked.name);
      if (!updated) {
        toast.error("Could not upload resume");
        return;
      }
      try {
        await parseResumeFile(picked.name);
      } catch {
        /* optional parse */
      }
      toast.success("New resume uploaded successfully");
      onCandidateUpdated(updated);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (!resumeUrl && !file) {
      toast.error("No resume file available");
      return;
    }
    const link = document.createElement("a");
    link.href = resumeUrl ?? "#";
    link.download = file;
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleOpenFull = () => {
    if (resumeUrl?.startsWith("http")) {
      window.open(resumeUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setFullOpen(true);
  };

  const actionButtons = hasResume ? (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1 rounded-[8px] px-2.5 text-[12px]"
        onClick={handleDownload}
      >
        <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        Download
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1 rounded-[8px] px-2.5 text-[12px]"
        onClick={handleOpenFull}
      >
        <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        Open full
      </Button>
      <Button
        ref={deleteTriggerRef}
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 gap-1 rounded-[8px] px-2.5 text-[12px] font-medium text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        Delete resume
      </Button>
    </div>
  ) : null;

  return (
    <>
      <section className={shellClass}>
        <header className="mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className={headingClass}>Resume</h3>
            {hasResume ? (
              <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#71717A]">
                <div>
                  <dt className={cn(dashboardLabel, "normal-case tracking-normal")}>File</dt>
                  <dd className="mt-0.5 text-[13px] font-medium text-[#52525B]">{file}</dd>
                </div>
                {candidate.resumeUploadedAt ? (
                  <div>
                    <dt className={cn(dashboardLabel, "normal-case tracking-normal")}>Uploaded</dt>
                    <dd className="mt-0.5 text-[13px] font-medium text-[#52525B]">
                      {candidate.resumeUploadedAt}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className={cn(dashboardLabel, "normal-case tracking-normal")}>Status</dt>
                  <dd className="mt-0.5 text-[13px] font-medium text-[#52525B]">{parsedStatus}</dd>
                </div>
              </dl>
            ) : (
              <p className={cn(dashboardSectionSub, "mt-1")}>{parsedStatus}</p>
            )}
          </div>
          {actionButtons}
        </header>

        {hasResume ? (
          <ResumePreviewFrame fileName={file} resumeUrl={resumeUrl} candidate={candidate} profile={profile} />
        ) : (
          <div className="space-y-4">
            <div
              className={cn(
                dashboardPanel,
                "flex min-h-[min(320px,45vh)] flex-col items-center justify-center px-6 py-10 text-center",
              )}
            >
              <FileText className="h-10 w-10 text-[#D4D4D8]" strokeWidth={1.5} aria-hidden />
              <p className="mt-3 text-[15px] font-medium text-[#18181B] dark:text-text">No resume uploaded</p>
              <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-[#71717A]">
                Upload a resume to preview it here. Supported formats: PDF, DOC, and DOCX.
              </p>
            </div>
            <label
              ref={uploadAreaRef}
              tabIndex={0}
              htmlFor={`resume-upload-report-${candidate.id}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors",
                "border-[rgba(15,23,42,0.1)] bg-[#FAFAFB] hover:border-accent/30 hover:bg-accent/5",
                "focus-visible:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20",
                "dark:bg-white/[0.02]",
                uploading && "pointer-events-none opacity-70",
              )}
            >
              {uploading ? (
                <>
                  <Loader2 className="mb-2 h-8 w-8 animate-spin text-accent" aria-hidden />
                  <span className="text-[14px] font-medium text-text">Uploading…</span>
                </>
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-muted" strokeWidth={1.5} aria-hidden />
                  <span className="text-[14px] font-medium text-text">Drag and drop resume here</span>
                  <span className="mt-1 text-[12px] text-muted">PDF, DOC, or DOCX — up to 10MB</span>
                </>
              )}
              <input
                ref={fileInputRef}
                id={`resume-upload-report-${candidate.id}`}
                type="file"
                className="sr-only"
                accept=".pdf,.doc,.docx"
                disabled={uploading}
                onChange={(e) => {
                  const picked = e.target.files?.[0];
                  if (picked) void handleFile(picked);
                }}
              />
            </label>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full rounded-[10px] text-[13px]"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Upload resume
            </Button>
          </div>
        )}
      </section>

      <Dialog open={fullOpen} onOpenChange={setFullOpen}>
        <DialogContent overlayClassName="z-[230]" className="z-[230] flex max-h-[min(92vh,900px)] max-w-4xl flex-col gap-0 p-0">
          <DialogHeader className="border-b border-[rgba(15,23,42,0.06)] px-5 pb-4 pt-5">
            <DialogTitle className="truncate pr-8 text-[1.0625rem]">{file}</DialogTitle>
            <DialogDescription className="text-[13px]">
              {parsedStatus}
              {candidate.resumeUploadedAt ? ` · Uploaded ${candidate.resumeUploadedAt}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-hidden p-4">
            <ResumePreviewFrame fileName={file} resumeUrl={resumeUrl} candidate={candidate} profile={profile} className="min-h-[min(70vh,720px)]" />
          </div>
          <div className="flex justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] px-5 py-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setFullOpen(false)}>
              Close
            </Button>
            <Button type="button" size="sm" className="gap-1" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteResumeAlertDialog
        open={deleteOpen}
        onOpenChange={handleDeleteOpenChange}
        onConfirm={() => void handleDeleteConfirm()}
        confirming={deleting}
      />
    </>
  );
}
