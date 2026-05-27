"use client";

import {
  Briefcase,
  Building2,
  Globe,
  Link2,
  Share2,
  Upload,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeSource, type CandidateSource } from "@/lib/hiring/stages";

const SOURCE_SHORT: Record<string, string> = {
  "Careers Website": "Career Site",
  LinkedIn: "LinkedIn",
  Referral: "Referral",
  "Direct Upload": "Direct",
  Agency: "Agency",
  Campus: "Campus",
  Naukri: "Naukri",
  "Internal Upload": "Internal",
  "Walk-in": "Walk-in",
  Other: "Other",
};

function sourceKey(source: string): CandidateSource {
  return normalizeSource(source);
}

export function sourceShortLabel(source: string): string {
  const key = sourceKey(source);
  return SOURCE_SHORT[key] ?? key;
}

export function CandidateSourceIcon({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  const key = sourceKey(source);
  const Icon =
    key === "LinkedIn"
      ? Link2
      : key === "Referral"
        ? UserPlus
        : key === "Careers Website" || key === "Naukri"
          ? Globe
          : key === "Agency"
            ? Building2
            : key === "Campus"
              ? Briefcase
              : key === "Direct Upload" || key === "Internal Upload"
                ? Upload
                : Share2;

  return <Icon className={cn("shrink-0 text-muted", className)} strokeWidth={1.75} aria-hidden />;
}
