"use client";

import { SkeletonBox } from "./primitives";

/* ═══════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════ */

export function DashboardSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-[160px] rounded-[20px]" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} className="h-[100px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <SkeletonBox className="h-[260px] lg:col-span-8" />
        <SkeletonBox className="h-[260px] lg:col-span-4" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   JOBS
   ═══════════════════════════════════════════════════ */

export function JobsSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-[160px] rounded-[20px]" />
      <SkeletonBox className="h-9 w-[360px] rounded-[10px]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} className="h-[180px]" />
        ))}
      </div>
      <SkeletonBox className="h-8 w-[200px] rounded-[10px]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   JOB DETAILS
   ═══════════════════════════════════════════════════ */

export function JobDetailsSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-[160px] rounded-[20px]" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-[100px]" />
        ))}
      </div>
      <SkeletonBox className="h-9 w-[300px] rounded-[10px]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, col) => (
          <div key={col} className="space-y-3">
            <SkeletonBox className="h-6 w-24 rounded-[8px]" />
            <SkeletonBox className="h-[90px]" />
            <SkeletonBox className="h-[90px]" />
            <SkeletonBox className="h-[90px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CANDIDATES
   ═══════════════════════════════════════════════════ */

export function CandidatesSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-[120px] rounded-[20px]" />
      <SkeletonBox className="h-9 w-[400px] rounded-[10px]" />
      <SkeletonBox className="h-[420px]" />
      <SkeletonBox className="h-8 w-[200px] rounded-[10px]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CANDIDATE REPORT
   ═══════════════════════════════════════════════════ */

export function CandidateReportSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-[120px] rounded-[20px]" />
      <SkeletonBox className="h-9 w-[300px] rounded-[10px]" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SkeletonBox className="h-[300px]" />
        <SkeletonBox className="h-[300px] lg:col-span-2" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   INTERVIEWS
   ═══════════════════════════════════════════════════ */

export function InterviewsSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-[160px] rounded-[20px]" />
      <SkeletonBox className="h-9 w-[320px] rounded-[10px]" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBox key={i} className="h-[72px]" />
        ))}
      </div>
      <SkeletonBox className="h-8 w-[180px] rounded-[10px]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   INTERVIEW DETAILS
   ═══════════════════════════════════════════════════ */

export function InterviewDetailsSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-[160px] rounded-[20px]" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SkeletonBox className="h-[320px] lg:col-span-2" />
        <SkeletonBox className="h-[320px]" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MY SCHEDULE
   ═══════════════════════════════════════════════════ */

export function MyScheduleSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-10 w-[280px] rounded-[10px]" />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, col) => (
          <SkeletonBox key={col} className="h-[320px]" />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ASSESSMENTS
   ═══════════════════════════════════════════════════ */

export function AssessmentsSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-[160px] rounded-[20px]" />
      <SkeletonBox className="h-9 w-[340px] rounded-[10px]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} className="h-[180px]" />
        ))}
      </div>
      <SkeletonBox className="h-8 w-[200px] rounded-[10px]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ASSESSMENT DETAILS
   ═══════════════════════════════════════════════════ */

export function AssessmentDetailsSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-[160px] rounded-[20px]" />
      <SkeletonBox className="h-9 w-[280px] rounded-[10px]" />
      <SkeletonBox className="h-[380px]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ASSESSMENT CANDIDATE REPORT
   ═══════════════════════════════════════════════════ */

export function AssessmentCandidateReportSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-[120px] rounded-[20px]" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-[100px]" />
        ))}
      </div>
      <SkeletonBox className="h-9 w-[260px] rounded-[10px]" />
      <SkeletonBox className="h-[240px]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ASSESSMENT DRIVE
   ═══════════════════════════════════════════════════ */

export function AssessmentDriveSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-9 w-[240px] rounded-[10px]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBox key={i} className="h-[160px]" />
        ))}
      </div>
      <SkeletonBox className="h-[240px]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   QUESTION POOL
   ═══════════════════════════════════════════════════ */

export function QuestionPoolSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-[120px] rounded-[20px]" />
      <SkeletonBox className="h-9 w-[320px] rounded-[10px]" />
      <SkeletonBox className="h-9 w-[260px] rounded-[10px]" />
      <SkeletonBox className="h-[380px]" />
      <SkeletonBox className="h-8 w-[200px] rounded-[10px]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   QUESTION EDITOR
   ═══════════════════════════════════════════════════ */

export function QuestionEditorSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="mx-auto h-9 w-[300px] rounded-[10px]" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <SkeletonBox className="h-[400px] lg:col-span-3" />
        <SkeletonBox className="h-[400px] lg:col-span-2" />
      </div>
      <SkeletonBox className="h-12 rounded-[10px]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   REPORTS
   ═══════════════════════════════════════════════════ */

export function ReportsSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-10 w-[200px] rounded-[10px]" />
      <SkeletonBox className="h-9 w-[300px] rounded-[10px]" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-[100px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SkeletonBox className="h-[220px]" />
        <SkeletonBox className="h-[220px]" />
      </div>
      <SkeletonBox className="h-[200px]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SETTINGS
   ═══════════════════════════════════════════════════ */

export function SettingsSkeleton() {
  return (
    <div className="py-2">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[200px_1fr]">
        <SkeletonBox className="h-[320px]" />
        <div className="space-y-5">
          <SkeletonBox className="h-[120px] rounded-[20px]" />
          <SkeletonBox className="h-[160px]" />
          <SkeletonBox className="h-[160px]" />
          <SkeletonBox className="h-[160px]" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ENTERPRISES
   ═══════════════════════════════════════════════════ */

export function EnterprisesSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-[120px] rounded-[20px]" />
      <SkeletonBox className="h-9 w-[280px] rounded-[10px]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} className="h-[140px]" />
        ))}
      </div>
      <SkeletonBox className="h-8 w-[180px] rounded-[10px]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ENTERPRISE DETAILS
   ═══════════════════════════════════════════════════ */

export function EnterpriseDetailsSkeleton() {
  return (
    <div className="space-y-5 py-2">
      <SkeletonBox className="h-[160px] rounded-[20px]" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-[100px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SkeletonBox className="h-[280px]" />
        <SkeletonBox className="h-[280px]" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LOGIN / SIGNUP
   ═══════════════════════════════════════════════════ */

export function LoginSignupSkeleton() {
  return (
    <div className="relative flex min-h-[600px] items-center justify-center overflow-hidden rounded-[20px] bg-[#1a0533] px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="relative z-10 w-full max-w-[440px] space-y-6">
        <SkeletonBox className="mx-auto h-9 w-[120px] rounded-[10px] bg-white/[0.08]" />
        <SkeletonBox className="h-[380px] rounded-[20px] bg-white/[0.08]" />
        <SkeletonBox className="mx-auto h-4 w-[180px] rounded-[8px] bg-white/[0.06]" />
      </div>
    </div>
  );
}
