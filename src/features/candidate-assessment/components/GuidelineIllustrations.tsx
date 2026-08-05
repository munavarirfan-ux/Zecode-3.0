"use client";

import { cn } from "@/lib/utils";

/**
 * Guideline illustrations — a consistent set of clean, flat vector scenes for
 * the progressive assessment onboarding flow. They share one visual language:
 * rounded geometric shapes, soft tinted background blobs, no strokes-as-art,
 * and the Ze[code] palette (purple #7100BD plus blue / cyan / amber / emerald
 * / neutral slate tones). Each is decorative — hidden from screen readers.
 */

type IlloProps = { className?: string };

function Svg({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 320 260" fill="none" role="presentation" aria-hidden className={className}>
      {children}
    </svg>
  );
}

/* 1 — Assessment overview: uses the provided branded illustration asset */
export function OverviewIllo({ className }: IlloProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/illustrations/assessment-overview.png"
      alt=""
      role="presentation"
      aria-hidden
      className={cn("object-contain", className)}
    />
  );
}

/* 2 — Environment: uses the provided branded illustration asset */
export function EnvironmentIllo({ className }: IlloProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/illustrations/environment.png"
      alt=""
      role="presentation"
      aria-hidden
      className={cn("object-contain", className)}
    />
  );
}

/* 3 — Code submission: uses the provided branded illustration asset */
export function SubmissionIllo({ className }: IlloProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/illustrations/code-submission.png"
      alt=""
      role="presentation"
      aria-hidden
      className={cn("object-contain", className)}
    />
  );
}

/* 4 — Compliance: uses the provided branded illustration asset */
export function ComplianceIllo({ className }: IlloProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/illustrations/compliance.png"
      alt=""
      role="presentation"
      aria-hidden
      className={cn("object-contain", className)}
    />
  );
}

/* 5 — Exam navigation: uses the provided branded illustration asset */
export function NavigationIllo({ className }: IlloProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/illustrations/navigation.png"
      alt=""
      role="presentation"
      aria-hidden
      className={cn("object-contain", className)}
    />
  );
}

/* 6 — Active monitoring: uses the provided branded illustration asset */
export function MonitoringIllo({ className }: IlloProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/illustrations/monitoring.png"
      alt=""
      role="presentation"
      aria-hidden
      className={cn("object-contain", className)}
    />
  );
}

/* Final — You're ready to begin: shield check + sparkles */
export function ReadyIllo({ className }: IlloProps) {
  return (
    <Svg className={className}>
      <circle cx="160" cy="128" r="92" fill="#7100BD" opacity="0.05" />
      <circle cx="86" cy="78" r="40" fill="#059669" opacity="0.07" />
      <circle cx="240" cy="188" r="46" fill="#2563EB" opacity="0.06" />

      {/* central shield */}
      <path d="M160 52 l64 24 v50 c0 46 -34 72 -64 84 c-30 -12 -64 -38 -64 -84 v-50 z" fill="#F4EBFA" stroke="#7100BD" strokeWidth="2.5" />
      <circle cx="160" cy="128" r="34" fill="#7100BD" />
      <path d="M144 128 l10 10 l22 -24" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* sparkles */}
      <g fill="#F59E0B">
        <path d="M96 108 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" />
        <path d="M232 96 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 z" />
      </g>
      <circle cx="108" cy="184" r="4" fill="#059669" />
      <circle cx="224" cy="168" r="4" fill="#2563EB" />
      <circle cx="252" cy="120" r="3" fill="#7100BD" />
    </Svg>
  );
}
